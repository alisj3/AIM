import { FormBlock } from "../components/Form/FormBlock";
import { Info } from "../components/Info/Info";
import { Intro } from "../components/Intro/Intro";
import { Solutions } from "../components/Solutions/Solution";
import { HomeLayout } from "../Layouts/HomeLayout";
import { useTranslation } from 'react-i18next'

const stylesFromProps = {
  width: '100%'
};

const infoTextStyles = {
  flexDirection: 'row-reverse',
  alignItems: 'center',
};

export function HomePage() {

      const {t, i18n} = useTranslation()

  return (
    <div style={{ backgroundColor: "#ffdb15", position: "relative" }}>
      <HomeLayout />
      <img style={{ position: "absolute", right: "0", top: "380px" }} src="/hands.png" alt="Hands" />
      <Intro />
      
      <Info 
        title={t("Ecosystem")} 
        subtitle={t("EcosystemSubtitle")} 
        text="" 
        image="AI" 
        imageText={t("EcosystemDescription")}
        textAlign="center" 
        infoId = "ecosystem"
        anyStyle={{
          animation: "pulseAndRotate 3s infinite ease-in-out",
        }} 
      />

      <Info 
        title={t("NeuroStorage")}
        subtitle={t("NeuroStorageSubtitle")} 
        text={t("NeuroStorageText")} 
        image="Example" 
        imageText=""  
        infoId="neurostorage"
        textAlign="left" 
      />

      <Info 
        title={t("Conscious")} 
        subtitle={t("ConsciousSubtitle")} 
        text={t("ConsciousText")}
        image="Assistant" 
        imageText={t("ConsciousImageText")} 
        infoId="conscious"
        textAlign="left" 
        anyStyle = {{
          width: "80%"
        }}
      />

      <Info 
        title="TODO - JARVIS" 
        subtitle={t("JarvisSubtitle")} 
        text={t("JarvisText")} 
        image="Neiro" 
        infoId="jarvis"
        imageText=""  
        textAlign="left" 
      />

      <Info 
        specialTextColour="#fff" 
        title={t("JarvisSolutions")} 
        subtitle={t("JarvisSolutionsSubtitle")} 
        text={t("JarvisSolutionsText")} 
        image="Jarvis" 
        imageText=""  
        infoId="jarvissolution"
        textAlign="left" 
        backGroundColor="#000" 
        textColor="#ffdb15" 
      />

      <Info 
        infoTextStyles={infoTextStyles} 
        specialTextColour="#fff" 
        title={t("TodoTitle")} 
        subtitle={t("TodoSubtitle")}
        text={t("TodoText")} 
        anyStyle={stylesFromProps}  
        image="ToDo" 
        imageText=""  
        textAlign="left" 
        backGroundColor="#000" 
        textColor="#ffdb15" 
      />

      <Solutions />
      
      <Info 
        title={t("JarvisPros")}
        text={t("JarvisProsText")} 
      />

      <FormBlock />
    </div>
  );
}
