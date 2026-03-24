import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Video() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams();

  const [video, setVideo] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [erro, setErro] = useState(false);


  useEffect(() => {
    if (!video) {
      setLoading(true);

      axios
        .get(`http://localhost:3000/videos/${name}`)
        .then((res) => {
          setVideo(res.data);
          setErro(false);
        })
        .catch((err) => {
          console.error(err);
          setErro(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [name]);


  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Carregando vídeo...</h2>
      </div>
    );
  }


  if (erro || !video) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>Erro ao carregar vídeo</h2>
          <p>Parâmetro: {name}</p>

          <button style={styles.botao} onClick={() => navigate("/")}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>{video.nome}</h1>
      </div>

      <div style={styles.videoWrapper}>
        <video style={styles.video} controls>
          <source src={video.url} type="video/mp4" />
        </video>
      </div>

      <button
        style={styles.botao}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e50914")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "red")}
        onClick={() => navigate("/")}
      >
        Voltar
      </button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#141414",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    marginBottom: "20px",
  },

  titulo: {
    fontSize: "32px",
    textAlign: "center",
  },

  videoWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  video: {
    width: "80%",
    maxWidth: "900px",
    borderRadius: "12px",
    boxShadow: "0 0 25px rgba(0,0,0,0.8)",
  },

  botao: {
    marginTop: "25px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  errorBox: {
    backgroundColor: "#222",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
  },

  errorTitle: {
    marginBottom: "10px",
  },
};