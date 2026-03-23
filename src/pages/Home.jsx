import { useEffect, useState } from "react";
import "./Home.css";

function Home() {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/videos")
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.log(err));
  }, []);


  function handleUpload(e) {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData
    })
    .then(() => {
      alert("Upload feito");
      window.location.reload();
    });

  }


  return (
    <div className="container">

      <h1 className="title">🎬 Plataforma de Streaming</h1>

      <div className="uploadBox">

        <h3>Upload de vídeo</h3>

        <input type="file" onChange={handleUpload} />

      </div>


      <div className="listBox">

        <h3>Lista de vídeos</h3>

        {videos.map((v, i) => (
          <div key={i} className="videoItem">

            <a href={"/video/" + v}>
              {v}
            </a>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Home;