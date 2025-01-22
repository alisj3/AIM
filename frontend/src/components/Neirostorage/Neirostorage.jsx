import './Neirostorage.css';
import { db } from '../../firebase/firebase';
import { collection, doc, addDoc, setDoc, arrayUnion, updateDoc, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';

export function Neirostorage() {
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
        <h1>Нейросклад</h1>
        <p>Создавайте товары и управляйте своим бизнесом</p>
      </div>

      <div className="neirostorage-container">
        <div className="table-title">
          <h1>Категории</h1>
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
                      <th>Наименование Товара</th>
                      <th>Описание</th>
                      <th>Цена</th>
                      <th>Валюта</th>
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
                        <td colSpan="4">Нет товаров в этой категории.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {popupSeen ? (
                  <div className="add-data-form">
                    <h3>Добавить данные</h3>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Наименование"
                        value={newRow[0]}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Описание"
                        value={newRow[1]}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Цена"
                        value={newRow[2]}
                        onChange={(e) => handleInputChange(2, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Валюта"
                        value={newRow[3]}
                        onChange={(e) => handleInputChange(3, e.target.value)}
                      />
                    </div>
                    <button className="add-data-button" onClick={addRowToTable}>
                      Добавить
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null
          )}
          <button className='create-product' onClick={togglePop}>Создать Товар</button>
        </div>
      </div>
    </div>
  );
}
