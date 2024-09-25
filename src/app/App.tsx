import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import { loadWasm, validator } from './validator'
// import { defaultItaly } from './contents/publiccode'
import { useTranslation } from 'react-i18next'
import store from './store'
import { Provider } from "react-redux";
import Editor from './components/Editor'
import Layout from './components/Layout'


// const defaultValues = {
//   publiccodeYmlVersion: "0.4",
//   legal: {},
//   localisation: { availableLanguages: [] },
//   maintenance: {},
//   platforms: [],
//   categories: [],
//   it: defaultItaly,
// };



// function App() {
//   const [count, setCount] = useState(0)

//   const load = useCallback(async () => {
//     const wasmModule = await loadWasm();
  
//     if (wasmModule) { 
//       const res = await validator(JSON.stringify(defaultValues), "main");
  
//       console.log(res)
//       setCount(res?.errors?.length ?? 0)
//     }
  
//   },[]);

//   useEffect(() => {
//     load();
//   }, [])

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export const App = () => {
  const [isLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      {isLoading && (
        <div className="d-flex align-items-center col-12 position-absolute h-100 w-100">
          <div className="mr-auto ml-auto">
            <h3>{t("validation.inprogress")}</h3>
            <div
              className="spinner-grow text-primary"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      )}
      <Layout isLoading={isLoading}>
        <Editor />
      </Layout>
    </Provider>
  );
};

export default App
