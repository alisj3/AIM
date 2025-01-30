import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import emailjs from "emailjs-com";
import { db } from "../../firebase/firebase";
import "./Support.css";

export function Support() {
  const [emailFromDB, setEmailFromDB] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData?.email) {
          setEmailFromDB(userData.email);
        }
      }
    } catch (err) {
      console.error("Error fetching user email:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...files];
      for (let i = 0; i < e.target.files.length; i++) {
        newFiles.push(e.target.files[i]);
      }
      setFiles(newFiles);
    }
  };

  const handleRemoveFile = (fileIndex) => {
    const updated = files.filter((_, i) => i !== fileIndex);
    setFiles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      form: emailFromDB,
      to_name: "aimcompany2025@gmail.com",
      message,
      from_name: name,
    };
    try { 
      const response = await emailjs.send(
        "service_hgnc20n",
        "template_c714yia",
        formData,
        "F3IuCP908l8ln97wV"
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <div className="support">
      <h1>Тех. Поддержка</h1>
      <p>Напишите о вашей проблеме, и мы в скором времени поможем вам</p>
      <form className="support-form" onSubmit={handleSubmit}>
        <h3>E-MAIL</h3>
        <div className="readonly-email">{emailFromDB || "Загрузка..."}</div>
        <h3>СООБЩЕНИЕ</h3>
        <div className="support-textarea">
          <textarea
            placeholder="Опишите свою проблему"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <label className="file-upload-label-new">
            Прикрепить файлы
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
        {files.length > 0 && (
          <div className="files-list">
            {files.map((file, index) => {
              const sizeKB = (file.size / 1024).toFixed(1);
              return (
                <div key={index} className="file-item">
                  <span className="file-name">
                    {file.name} ({sizeKB} КБ)
                  </span>
                  <span
                    className="file-remove"
                    onClick={() => handleRemoveFile(index)}
                  >
                    ✕
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <h3>ИМЯ</h3>
        <div className="support-name-input">
          <input
            className="name-input-text"
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input className="name-input-submit" type="submit" value="Отправить" />
        </div>
      </form>
    </div>
  );
}
