import { FormBlock } from "../components/Form/FormBlock";
import { Info } from "../components/Info/Info";
import { Intro } from "../components/Intro/Intro";
import { Solutions } from "../components/Solutions/Solution";
import { HomeLayout } from "../Layouts/HomeLayout";

const stylesFromProps = {
  width: '100%',
};

const infoTextStyles = {
  flexDirection: 'row-reverse',
  alignItems: 'center',
};

export function HomePage() {
  return (
    <div style={{ backgroundColor: "#ffdb15", position: "relative" }}>
      <HomeLayout />
      <img style={{ position: "absolute", right: "0", top: "380px" }} src="/hands.png" alt="Hands" />
      <Intro />
      
      <Info 
        title="ЦИФРОВАЯ ЭКОСИСТЕМА" 
        subtitle="ЭКОСИСТЕМА У ЦИФРОВЫХ ВАРИАТИВОВ КОННЕКТОМОВ И АССИСТЕНТОВ" 
        text="" 
        image="AI" 
        imageText="Связанные между собой данные что позволит вам легко переключатся с одного нашего устройства на другое а также использовать весь наш функционал когда угодно и как угодно x/." 
        textAlign="center" 
        anyStyle={{
          animation: "pulseAndRotate 3s infinite ease-in-out"
        }} 
      />

      <Info 
        title="НЕЙРОСКЛАД" 
        subtitle="НЕЙРО-МЕНЕДЖЕР КОНСУЛЬТАНТ" 
        text="Данный сервис позволяет заменить менеджеров на ИИ. Будь это общение через соц-сети или мессенджеры, в будущем можно сделать ИИ-Роботов которые полностью заменят консультантов в магазинах" 
        image="Example" 
        imageText=""  
        textAlign="left" 
      />

      <Info 
        title="СОЗНАНИЕ" 
        subtitle="ПРЕДСТАВЬТЕ ВАШЕ СОЗНАНИЕ В ЦИФРОВОМ ФОРМАТЕ" 
        text="Данный сервис позволит воссоздать сознание одного человека. Внедренный в коннетомы и посредством отбора лучшей информативности и отображения мы предлагаем вариант сделать ключевую “паутину” из одной точки, идущую по цепям на разные нейросети. Каждая нейросеть имеет свою задачу, отвечающую за память, за эмоции (для системы это регулировка на основе характера человека). То есть описывается образ человека. По возможности внедряются знания данного человека, а также нейросеть сама дополняет данные знания посредством обучения." 
        image="Assistant" 
        imageText="Пример на основе GPT - 4o"  
        textAlign="left" 
      />

      <Info 
        title="TODO - JARVIS" 
        subtitle="НЕЙРО-ПОМОЩНИК" 
        text="Необходимо делегировать задачи чтобы нейросеть создала вам простую презентацию и сохранила его? Или чтобы он позвонил вашему сотруднику, другу, или близкому чтобы сказать какую то важную информацию? Для этого есть Нейро Ассистент" 
        image="Neiro" 
        imageText=""  
        textAlign="left" 
      />

      <Info 
        specialTextColour="#fff" 
        title="КАКИЕ ИННОВАЦИОННЫЕ РЕШЕНИЯ У JARVIS" 
        subtitle="ЧТО МЫ МОЖЕМ ПРЕДЛОЖИТЬ" 
        text="• JARVIS – это высокоинтеллектуальная нейросеть с коннектами и доступом к вашим данным, позволяющая выполнять задачи из вашего TODO. Если у вас есть 'Нейросклад' или 'Сознание', вы можете использовать их так, как вам удобно: сделать JARVIS вашим повседневным помощником или виртуальным бизнес-ассистентом, полностью адаптировав его под свои потребности." 
        image="Jarvis" 
        imageText=""  
        textAlign="left" 
        backGroundColor="#000" 
        textColor="#ffdb15" 
      />

      <Info 
        infoTextStyles={infoTextStyles} 
        specialTextColour="#fff" 
        title="КАКИЕ ИННОВАЦИОННЫЕ РЕШЕНИЯ У TODO" 
        subtitle="ЧТО МЫ МОЖЕМ ПРЕДЛОЖИТЬ" 
        text={<>• Создавайте задачу для себя, а если нейросеть способна сделать данную задачу, то вы можете делегировать её и освободить своё время <br /><br /> • Звонки от нейросети благодаря Speech & Recognize Technology <br /><br /> • Создание презентаций на основе Gamma, Wepick, Prezo <br /><br /> • Создание изображений от GPT-4 <br /><br /> • ССоздание видеоматериалов на основе GEMINI и SORA </>} 
        anyStyle={stylesFromProps}  
        image="ToDo" 
        imageText=""  
        textAlign="left" 
        backGroundColor="#000" 
        textColor="#ffdb15" 
      />

      <Solutions />
      
      <Info 
        title="ПОЛЬЗА ОТ ДОК-СТАНЦИИ" 
        text={<>• Внедрение TODO-JARVIS который будет не только общяться повседневно но и прикреплять задачи пользователя а также выполнять их <br /><br /> • Внедренный "Нейросклад" позволяющий предпринемателям кластеризовать события по продажам, аналитика от нейросети, общий расход товаров и доход в целом. Также он может помочь "Предсказать" рынок, давать маркеттинговые советы по товарам.  <br /><br /> • Внедрение "Сознание" позволяющие внедрить сознание внутрь ДОК-Станции и общяться с ним как с человеком </>} 
      />

      <FormBlock />
    </div>
  );
}
