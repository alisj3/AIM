import './Conscious.css';
import { db } from '../../firebase/firebase';
import { collection, doc, addDoc, setDoc, arrayUnion, updateDoc, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

export function Conscious() {
  const {t, i18n} = useTranslation()

  const [botCategories, setBotCategories] = useState([]);
  const [activeBotCategory, setActiveBotCategory] = useState('');
  const [newBotData, setNewBotData] = useState(['', '', '', '']);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchBotCategories();
  }, []);

  const handleBotCategoryChange = (category) => {
    setActiveBotCategory(category);
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
  };

  const fetchBotCategories = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const userBotsCollection = collection(db, `Users/${user.uid}/Bots`);
      const querySnapshot = await getDocs(userBotsCollection);

      const userBotCategories = [];
      querySnapshot.forEach((doc) => {
        userBotCategories.push({
          id: doc.id,
          name: doc.data().name,
          bots: doc.data().bots || [],
        });
      });

      setBotCategories(userBotCategories);
    } catch (e) {
      console.error("Error fetching bot categories:", e);
    }
  };

  const addBotCategory = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const newBotCategoryName = `Сознание ${botCategories.length + 1}`;

    try {
      const userBotsCollection = collection(db, `Users/${user.uid}/Bots`);
      const docRef = await addDoc(userBotsCollection, {
        name: newBotCategoryName,
        bots: [],
      });

      const newBotCategory = { id: docRef.id, name: newBotCategoryName, bots: [] };

      setBotCategories((prevCategories) => [...prevCategories, newBotCategory]);
      setActiveBotCategory(docRef.id);
    } catch (e) {
      console.error("Error adding bot category:", e);
    }
  };

  const handleBotInputChange = (index, value) => {
    const updatedData = [...newBotData];
    updatedData[index] = value;
    setNewBotData(updatedData);
  };

  const addBotToCategory = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    if (!activeBotCategory) {
      console.error("No active bot category selected.");
      return;
    }

    try {
      const categoryDocRef = doc(db, `Users/${user.uid}/Bots`, activeBotCategory);
      await updateDoc(categoryDocRef, {
        bots: arrayUnion({
          botName: newBotData[0],
          botDescription: newBotData[1],
          token: newBotData[2],
          base: newBotData[3],
        }),
      });

      setBotCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === activeBotCategory
            ? {
                ...category,
                bots: [
                  ...category.bots,
                  {
                    botName: newBotData[0],
                    botDescription: newBotData[1],
                    token: newBotData[2],
                    base: newBotData[3],
                  },
                ],
              }
            : category
        )
      );

      setNewBotData(['', '', '', '']);
      console.log("Bot added successfully.");
    } catch (e) {
      console.error("Error adding bot:", e);
    }
  };

  return (
    <div className="bot-creation">
      <div className="bot-creation-header">
        <h1>{t("BotCreationTitle")}</h1>
        <p>{t("BotCreationSubtitle")}</p>
      </div>

      <div className="bot-creation-content">
        <div className="bot-category-selection">
          <h1>{t("BotCategorySelection")}</h1>
          <div className="category-button-group">
            {botCategories.map((category) => (
              <button
                key={category.id}
                className={activeBotCategory === category.id ? 'active' : ''}
                onClick={() => handleBotCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
            <button className="add-category-button" onClick={addBotCategory}>
              +
            </button>
          </div>
        </div>

        <div className="bot-table">
          <div className="search-bar bot-search">
            <img src="/icons/search.png" className="search-icon" alt="search" />
            <input type="text" className="search-input" placeholder="Search" />
          </div>

          {botCategories.map((category) =>
            activeBotCategory === category.id ? (
              <div className="category-table" key={category.id}>
                <table>
                  <thead>
                    <tr>
                      <th>{t("Название Сознания")}</th>
                      <th>{t("Описание")}</th>
                      <th>{t("Токен/Месенджер")}</th>
                      <th>{t("База")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.bots && category.bots.length > 0 ? (
                      category.bots.map((bot, index) => (
                        <tr key={index}>
                          <td>{bot.botName}</td>
                          <td>{bot.botDescription}</td>
                          <td>{bot.token}</td>
                          <td>{bot.base}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">{t("NoBotsAvailable")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {formVisible ? (
                  <div className="bot-form">
                    <h3>{t("BotAddData")}</h3>
                    <div className="bot-input-group">
                      <input
                        type="text"
                        placeholder={t("BotName")}
                        value={newBotData[0]}
                        onChange={(e) => handleBotInputChange(0, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("BotDescription")}
                        value={newBotData[1]}
                        onChange={(e) => handleBotInputChange(1, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("BotPrice")}
                        value={newBotData[2]}
                        onChange={(e) => handleBotInputChange(2, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("BotCurrency")}
                        value={newBotData[3]}
                        onChange={(e) => handleBotInputChange(3, e.target.value)}
                      />
                    </div>
                    <button className="submit-bot-button" onClick={addBotToCategory}>
                      {t("BotAdd")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null
          )}
          <button className='create-bot' onClick={toggleForm}>Создать Бота</button>
        </div>
      </div>
    </div>
  );
}
