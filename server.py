from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import subprocess
import json
import re
import os
from datetime import datetime
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


class AIFlowchartGenerator:
    def __init__(self):
        self.node_counter = 0
        self.nodes = {}
        self.edges = []

    def call_ollama(self, prompt: str) -> str:
        """Call Ollama Llama3 model"""
        try:
            result = subprocess.run(
                ['ollama', 'run', 'llama3'],
                input=prompt,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=60
            )
            if result.returncode != 0:
                print(f"Ollama stderr: {result.stderr}")
            return result.stdout.strip()
        except subprocess.TimeoutExpired:
            print("Ollama timeout - using fallback")
            return ""
        except FileNotFoundError:
            print("Ollama not found - using fallback parser")
            return ""
        except Exception as e:
            print(f"Ollama error: {e}")
            return ""

    def parse_with_ai(self, text: str) -> dict:
        """Use Llama3 to parse text into hierarchical structure"""
        prompt = f"""Analyze this text and extract a hierarchical tree structure.
Return ONLY a valid JSON object with this exact format (no markdown, no explanation):
{{
  "nodes": [
    {{"id": "1", "text": "Root Node", "parent": null}},
    {{"id": "2", "text": "Child Node", "parent": "1"}},
    {{"id": "3", "text": "Another Child", "parent": "1"}},
    {{"id": "4", "text": "Grandchild", "parent": "2"}}
  ]
}}

Rules:
- Create a clear parent-child hierarchy
- Root nodes have parent: null
- Each node needs unique id, text, and parent reference
- Identify main topics, subtopics, and details
- Return ONLY the JSON, nothing else

Text to analyze:
{text}

JSON:"""

        response = self.call_ollama(prompt)

        # Try AI parsing first
        if response:
            try:
                cleaned = response.strip()
                if cleaned.startswith('```'):
                    cleaned = re.sub(r'^```json\s*', '', cleaned)
                    cleaned = re.sub(r'^```\s*', '', cleaned)
                    cleaned = re.sub(r'\s*```$', '', cleaned)

                data = json.loads(cleaned)
                if 'nodes' in data and isinstance(data['nodes'], list) and len(data['nodes']) > 0:
                    print(f"✓ AI parsed {len(data['nodes'])} nodes")
                    return data
            except Exception as e:
                print(f"AI parse error: {e}, using fallback")

        # Use fallback
        print("Using fallback parser")
        return self.fallback_parse(text)

    def fallback_parse(self, text: str) -> dict:
        """Improved fallback parser with indentation detection"""
        lines = [l.rstrip() for l in text.split('\n') if l.strip()]
        nodes = []

        if not lines:
            return {"nodes": [{"id": "1", "text": "Empty Input", "parent": None}]}

        def get_indent_level(line):
            """Count leading spaces/tabs"""
            stripped = line.lstrip()
            indent = len(line) - len(stripped)
            return indent // 4 if indent > 0 else 0  # Assume 4 spaces per level

        # Build hierarchy based on indentation
        stack = []  # Stack of (level, id)
        node_id = 1

        for line in lines:
            text = line.strip()
            if not text:
                continue

            level = get_indent_level(line)
            current_id = str(node_id)

            # Find parent
            parent = None
            while stack and stack[-1][0] >= level:
                stack.pop()

            if stack:
                parent = stack[-1][1]

            nodes.append({
                "id": current_id,
                "text": text[:100],  # Limit text length
                "parent": parent
            })

            stack.append((level, current_id))
            node_id += 1

        print(f"✓ Fallback parsed {len(nodes)} nodes")
        return {"nodes": nodes}

    def build_tree_from_ai(self, ai_response: dict) -> None:
        """Build tree from AI-parsed structure"""
        nodes_data = ai_response.get('nodes', [])

        if not nodes_data:
            raise ValueError("No nodes found in AI response")

        id_to_text = {}
        for node in nodes_data:
            node_id = f"node{node['id']}"
            text = node['text']
            self.nodes[text] = node_id
            id_to_text[node['id']] = text

        for node in nodes_data:
            if node['parent'] is not None:
                child_text = node['text']
                parent_text = id_to_text.get(node['parent'])
                if parent_text and parent_text in self.nodes:
                    parent_id = self.nodes[parent_text]
                    child_id = self.nodes[child_text]
                    self.edges.append((parent_id, child_id, parent_text, child_text))

    def generate_mermaid(self) -> str:
        """Generate Mermaid flowchart syntax with enhanced styling"""
        mermaid = ["graph TD"]

        for text, node_id in self.nodes.items():
            safe_text = text.replace('"', "'").replace('[', '(').replace(']', ')').replace('\n', ' ')
            if len(safe_text) > 50:
                safe_text = safe_text[:47] + "..."
            mermaid.append(f'    {node_id}["{safe_text}"]')

        mermaid.append("")

        for parent_id, child_id, _, _ in self.edges:
            mermaid.append(f"    {parent_id} --> {child_id}")

        mermaid.append("")
        # Enhanced styling for better readability
        mermaid.append(
            "    classDef default fill:#e1f5ff,stroke:#01579b,stroke-width:3px,color:#000,font-size:16px,font-weight:bold,padding:15px")

        return "\n".join(mermaid)


@app.route('/generate', methods=['POST'])
def generate_flowchart():
    try:
        data = request.json
        input_text = data.get('text', '')

        if not input_text.strip():
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400

        print(f"\n{'=' * 60}")
        print(f"Generating flowchart for {len(input_text)} characters")

        # Generate flowchart
        generator = AIFlowchartGenerator()
        ai_structure = generator.parse_with_ai(input_text)
        generator.build_tree_from_ai(ai_structure)

        if not generator.nodes:
            return jsonify({
                'success': False,
                'error': 'Could not generate any nodes from the text'
            }), 400

        mermaid_code = generator.generate_mermaid()
        print(f"Generated mermaid with {len(generator.nodes)} nodes, {len(generator.edges)} edges")

        # Save mermaid file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        mmd_file = f'temp_diagram_{timestamp}.mmd'
        png_file = f'static/flowchart_{timestamp}.png'
        config_file = f'temp_config_{timestamp}.json'

        # Create static directory if it doesn't exist
        os.makedirs('static', exist_ok=True)

        with open(mmd_file, 'w', encoding='utf-8') as f:
            f.write(mermaid_code)

        # Create high-resolution config file
        config = {
            "theme": "default",
            "themeVariables": {
                "fontSize": "20px",
                "fontFamily": "Arial, sans-serif"
            },
            "flowchart": {
                "htmlLabels": True,
                "curve": "basis",
                "padding": 20
            }
        }

        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f)

        # Generate HIGH RESOLUTION PNG using mermaid-cli
        print("Generating HIGH RESOLUTION PNG with mermaid-cli...")

        try:
            # Try with shell=True for Windows
            import platform
            is_windows = platform.system() == 'Windows'

            # Use much higher resolution settings
            if is_windows:
                cmd = f'npx -y @mermaid-js/mermaid-cli -i "{mmd_file}" -o "{png_file}" -b white -w 3000 -H 2400 -s 3 -c "{config_file}"'
                result = subprocess.run(
                    cmd,
                    shell=True,
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    errors='replace',
                    timeout=90
                )
            else:
                result = subprocess.run(
                    ['npx', '-y', '@mermaid-js/mermaid-cli', '-i', mmd_file, '-o', png_file,
                     '-b', 'white', '-w', '3000', '-H', '2400', '-s', '3', '-c', config_file],
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    errors='replace',
                    timeout=90
                )
        except FileNotFoundError:
            print("✗ npx not found. Please install Node.js and run: npm install -g @mermaid-js/mermaid-cli")
            return jsonify({
                'success': False,
                'error': 'Mermaid CLI not found. Please install Node.js and run: npm install -g @mermaid-js/mermaid-cli'
            }), 500

        # Clean up temporary files
        if os.path.exists(mmd_file):
            os.remove(mmd_file)
        if os.path.exists(config_file):
            os.remove(config_file)

        if result.returncode == 0 and os.path.exists(png_file):
            print(f"✓ HIGH RESOLUTION PNG generated successfully: {png_file}")
            return jsonify({
                'success': True,
                'image_url': f'/static/{os.path.basename(png_file)}',
                'nodes': len(generator.nodes),
                'edges': len(generator.edges),
                'mermaid': mermaid_code
            })
        else:
            error_msg = result.stderr if result.stderr else "PNG generation failed"
            print(f"✗ PNG generation failed: {error_msg}")
            return jsonify({
                'success': False,
                'error': f'PNG generation failed: {error_msg}'
            }), 500

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"✗ Error: {error_trace}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/static/<path:filename>')
def serve_static(filename):
    try:
        return send_file(f'static/{filename}')
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 7860))  # Hugging Face uses 7860
    app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)