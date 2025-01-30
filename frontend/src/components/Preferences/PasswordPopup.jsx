import { useTranslation } from "react-i18next";
import { getAuth, updatePassword } from "firebase/auth";

export default function PasswordPopup({ newPassword, setNewPassword, onClose, setPasswordPopupVisible  }) {
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updatePassword(user, newPassword);
      alert(t("passwordChangeSuccess"));
      onClose();
    } catch (error) {
      console.error("Error updating password: ", error);
      alert(t("passwordChangeError"));
    }
  };

  return (
    <div className="password-popup">
        <div className="popup-content">
            <h3>{t("changePasswordPopupTitle")}</h3>
            <input
            type="password"
            placeholder={t("enterNewPasswordPlaceholder")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="popup-actions">
            <button onClick={handleChangePassword}>{t("submitButtonLabel")}</button>
            <button onClick={() => setPasswordPopupVisible(false)}>
                {t("cancelButtonLabel")}
            </button>
            </div>
        </div>
        </div>
  );
}
