import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURAÇÃO INICIAL ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- CONEXÃO COM O SUPABASE ---
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise Exception("Supabase URL e Key são obrigatórios no arquivo .env")

supabase: Client = create_client(url, key)
print("Cliente Supabase inicializado.")

# --- ROTAS DA API ---

@app.route("/")
def index():
    return jsonify({"message": "Servidor Python do Leitor de Placas está funcionando!"})
        
@app.route("/api/plate/<string:number>", methods=["GET"])
def get_plate(number):
    """
    Consulta uma placa enviada pelo frontend.
    """
    plate_number = number.upper()
    try:
        response = supabase.table('plates').select("*").eq('plate_number', plate_number).execute()
        if response.data:
            return jsonify({"message": "success", "data": response.data[0]})
        else:
            return jsonify({"message": f"A placa {plate_number} não foi encontrada."}), 404
    except Exception as e:
        print(f"Erro ao consultar o Supabase: {e}")
        return jsonify({"error": "Erro ao consultar o banco de dados"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)