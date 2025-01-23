import './Neirostorage.css';
import { db } from '../../firebase/firebase';
import { collection, doc, addDoc, setDoc, arrayUnion, updateDoc, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

export function Neirostorage() {
  const {t, i18n} = useTranslation()

  const [categories, setCategories] = useState([]);
  const [activeTable, setActiveTable] = useState('');
  const [newRow, setNewRow] = useState(['', '', '', '']);
  const [popupSeen, setPopupSeen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  const togglePop = () => {
    setPopupSeen(!popupSeen);
  };

  const fetchCategories = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const userProductsCollection = collection(db, `Users/${user.uid}/Products`);
      const querySnapshot = await getDocs(userProductsCollection);

      const userCategories = [];
      querySnapshot.forEach((doc) => {
        userCategories.push({
          id: doc.id,
          name: doc.data().name,
          products: doc.data().products || [],
        });
      });

      setCategories(userCategories);
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  };

  const addCategory = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const newCategoryName = `Категория ${categories.length + 1}`;

    try {
      const userProductsCollection = collection(db, `Users/${user.uid}/Products`);
      const docRef = await addDoc(userProductsCollection, {
        name: newCategoryName,
        products: [],
      });

      const newCategory = { id: docRef.id, name: newCategoryName, products: [] };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setActiveTable(docRef.id);
    } catch (e) {
      console.error("Error adding category:", e);
    }
  };

  const handleInputChange = (index, value) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const addRowToTable = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    if (!activeTable) {
      console.error("No active category selected.");
      return;
    }

    try {
      const tableDocRef = doc(db, `Users/${user.uid}/Products`, activeTable);
      await updateDoc(tableDocRef, {
        products: arrayUnion({
          name: newRow[0],
          description: newRow[1],
          price: newRow[2],
          currency: newRow[3],
        }),
      });

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === activeTable
            ? {
                ...category,
                products: [
                  ...category.products,
                  {
                    name: newRow[0],
                    description: newRow[1],
                    price: newRow[2],
                    currency: newRow[3],
                  },
                ],
              }
            : category
        )
      );

      setNewRow(['', '', '', '']);
      console.log("Product added successfully.");
    } catch (e) {
      console.error("Error adding product:", e);
    }
  };

  return (
    <div className="neirostorage">
      <div className="neirostorage-title">
        <h1>{t("MainNeurostorage")}</h1>
        <p>{t("NeurostorageSubtitle")}</p>
      </div>

      <div className="neirostorage-container">
        <div className="table-title">
          <h1>{t("NeurostorageCategiries")}</h1>
          <div className="button-group">
            {categories.map((category) => (
              <button
                key={category.id}
                className={activeTable === category.id ? 'active' : ''}
                onClick={() => handleTableChange(category.id)}
              >
                {category.name}
              </button>
            ))}
            <button className="add-category-button" onClick={addCategory}>
              +
            </button>
          </div>
        </div>

        <div className="dynamic-table">
          <div className="search-bar neiro-search">
            <img src="/icons/search.png" className="search-icon" alt="search" />
            <input type="text" className="search-input" placeholder="Поиск" />
          </div>

          {categories.map((category) =>
            activeTable === category.id ? (
              <div className="table" key={category.id}>
                <table>
                  <thead>
                    <tr>
                      <th>{t("ProductName")}</th>
                      <th>{t("ProductDescription")}</th>
                      <th>{t("ProductPrice")}</th>
                      <th>{t("ProductCurency")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products && category.products.length > 0 ? (
                      category.products.map((product, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.price}</td>
                          <td>{product.currency}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">{t("ProductNo")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {popupSeen ? (
                  <div className="add-data-form">
                    <h3>{t("ProductAddData")}</h3>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder={t("ProductName")}
                        value={newRow[0]}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("ProductDescription")}
                        value={newRow[1]}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("ProductPrice")}
                        value={newRow[2]}
                        onChange={(e) => handleInputChange(2, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("ProductCurency")}
                        value={newRow[3]}
                        onChange={(e) => handleInputChange(3, e.target.value)}
                      />
                    </div>
                    <button className="add-data-button" onClick={addRowToTable}>
                      {t("ProductAdd")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null
          )}
          <button className='create-product' onClick={togglePop}>{t("ProductCreate")}</button>
        </div>
      </div>
    </div>
  );
}
