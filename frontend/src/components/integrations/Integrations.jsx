import React, { useState, useEffect } from "react";
import "./Integrations.css";
import { db, auth } from '../../firebase/firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

const integrationsData = [
  {
    id: "telegram",
    name: "Telegram",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
    description: "Интеграция с Telegram для автоматизации общения.",
  },
  {
    id: "wazzup",
    name: "Wazzup",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111710.png",
    description: "Интеграция с Wazzup для управления сообщениями.",
  },
  {
    id: "1c",
    name: "1С",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111421.png",
    description: "Интеграция с 1С для бухгалтерии и управления.",
  },
  {
    id: "bitrix24",
    name: "Bitrix24",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111720.png",
    description: "Интеграция с Bitrix24 для CRM и коммуникаций.",
  },
  {
    id: "amocrm",
    name: "AmoCRM",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111758.png",
    description: "Интеграция с AmoCRM для управления клиентами.",
  },
  {
    id: "i2crm",
    name: "i2CRM",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111773.png",
    description: "Интеграция с i2CRM для расширенного управления.",
  },
  {
    id: "gosklad",
    name: "GoSklad",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111804.png",
    description: "Интеграция с GoSklad для управления складом.",
  },
  {
    id: "moisklad",
    name: "МойСклад",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111820.png",
    description: "Интеграция с МойСклад для учета и логистики.",
  },
];

const Integrations = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    token: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchIntegrationData = async () => {
      if (isPopupOpen && selectedIntegration && selectedIntegration.id === "telegram") {
        const user = auth.currentUser;

        if (user) {
          setIsLoading(true);
          try {
            const telegramDocRef = doc(db, "users", user.uid, "integrations", "telegram");
            const telegramDoc = await getDoc(telegramDocRef);
            if (telegramDoc.exists()) {
              const data = telegramDoc.data();
              setFormData({
                name: data.name || "",
                token: data.token || "",
              });
              console.log("Существующие данные Telegram загружены:", data);
            } else {
              console.log("Данные Telegram отсутствуют. Поля будут пустыми.");
              setFormData({
                name: "",
                token: "",
              });
            }
          } catch (error) {
            console.error("Ошибка при загрузке интеграции Telegram:", error);
            alert("Произошла ошибка при загрузке интеграции. Попробуйте снова.");
          } finally {
            setIsLoading(false);
          }
        } else {
          console.log("Пользователь не аутентифицирован.");
          alert("Пользователь не аутентифицирован.");
          handleClosePopup();
        }
      }
    };

    fetchIntegrationData();
  }, [isPopupOpen, selectedIntegration]);

  const handleIntegrationClick = (integration) => {
    if (integration.id === "telegram") {
      setSelectedIntegration(integration);
      setIsPopupOpen(true);
    } else {
      alert(`Интеграция с ${integration.name} пока не поддерживается.`);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedIntegration(null);
    setFormData({
      name: "",
      token: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.token.trim()) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    const user = auth.currentUser;
    console.log("Текущий пользователь:", user);

    if (!user) {
      alert("Пользователь не аутентифицирован.");
      return;
    }

    setIsSaving(true);

    try {
      const telegramDocRef = doc(db, "users", user.uid, "integrations", "telegram");
      console.log("Ссылка на документ:", telegramDocRef);

      await setDoc(
        telegramDocRef,
        {
          name: formData.name,
          token: formData.token,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log("Интеграция Telegram успешно сохранена:", formData);
      alert("Интеграция Telegram успешно настроена!");
      handleClosePopup();
    } catch (error) {
      console.error("Ошибка при сохранении интеграции:", error);
      alert("Произошла ошибка при сохранении интеграции. Попробуйте снова.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="integrations-container">
      <h2>Интеграции</h2>
      <div className="integration-list">
        {integrationsData.map((integration) => {
          console.log("Rendering integration:", integration.name);
          return (
            <div
              key={integration.id}
              className="integration-item"
              onClick={() => handleIntegrationClick(integration)}
            >
              <img src={integration.icon} alt={`${integration.name} Integration`} />
              <h3>{integration.name}</h3>
              <p>{integration.description}</p>
            </div>
          );
        })}
      </div>

      {isPopupOpen && selectedIntegration && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Настройка {selectedIntegration.name}</h3>
            {isLoading ? (
              <p>Загрузка...</p>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="name">Название</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Введите название"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="token">Токен бота</label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleInputChange}
                    placeholder="Введите токен бота"
                  />
                </div>
                <div className="popup-actions">
                  <button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Сохранение..." : "Сохранить"}
                  </button>
                  <button onClick={handleClosePopup}>Отмена</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
