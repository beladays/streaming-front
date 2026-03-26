import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 🔹 Buscar vídeos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data } = await axios.get("http://localhost:3000/videos");
        setVideos(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVideos();
  }, []);

  // 🔹 Upload com URL assinada
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1️⃣ pegar URL assinada
      const { data } = await axios.post(
        "http://localhost:3000/videos/upload-url",
        {
          fileName: file.name,
          contentType: file.type,
        }
      );

      const { url } = data;

      // 2️⃣ enviar arquivo direto pro S3 (fetch evita headers extras do axios)
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
      }

      alert("Upload feito 🚀");

      // 🔄 atualizar lista sem reload
      const updatedVideos = await axios.get("http://localhost:3000/videos");
      setVideos(updatedVideos.data);

    } catch (error) {
      console.error(error);
      alert("Erro no upload");
    }
  }

  return (
    <div className="container">
      <h1 className="title">🎬 Plataforma de Streaming</h1>

      <div className="uploadBox">
        <h3>Upload de vídeo</h3>
        <input type="file" accept="video/*" onChange={handleUpload} />
      </div>

      {/* 🔹 Player de vídeo */}
      {selectedVideo && (
        <div className="playerBox">
          <h3>▶️ {selectedVideo.name}</h3>
          <video
            controls
            autoPlay
            width="100%"
            src={selectedVideo.url}
            onError={() => alert("Erro ao carregar o vídeo")}
          />
          <button onClick={() => setSelectedVideo(null)}>✖ Fechar</button>
        </div>
      )}

      <div className="listBox">
        <h3>Lista de vídeos</h3>

        {videos.length === 0 && <p>Nenhum vídeo encontrado</p>}

        {videos.map((v, i) => (
          <div
            key={i}
            className="videoItem"
            onClick={() => setSelectedVideo(v)}
            style={{ cursor: "pointer" }}
          >
            🎬 {v.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

