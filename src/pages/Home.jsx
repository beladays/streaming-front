import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [videos, setVideos] = useState([]);
  const [erro, setErro] = useState(false);

  
  useEffect(() => {
    carregarVideos();
  }, []);

  async function carregarVideos() {
    try {
      const res = await axios.get("http://localhost:3000/videos");
      setVideos(res.data);
      setErro(false);
    } catch (err) {
      console.error(err);
      setErro(true);
    }
  }

  // upar
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // url
      const res = await axios.post(
        "http://localhost:3000/videos/upload-url",
        {
          fileName: file.name,
          contentType: file.type || "video/mp4",
        }
      );

      const { url } = res.data;

      //  storage
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type || "video/mp4",
        },
      });

      alert("Upload feito!");

      // atua
      await carregarVideos();

    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      alert("Erro no upload (veja o console)");
    }
  }

  return (
    <div className="container">
      <h1 className="title"> Plataforma de Streaming</h1>

      <div className="uploadBox">
        <h3>Upload de vídeo</h3>
        <input type="file" onChange={handleUpload} />
      </div>

      <div className="listBox">
        <h3>Lista de vídeos</h3>

        {erro && <p>Erro ao carregar vídeos</p>}

        {videos.length === 0 && !erro && (
          <p>Nenhum vídeo encontrado</p>
        )}

        {videos.map((v, i) => (
          <div key={i} className="videoItem">
            <Link to={`/video/${v.name}`} state={v}>
              {v.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;