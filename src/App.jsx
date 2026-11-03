import { UIProvider } from './context/UIContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ValuesStrip from './components/ValuesStrip'
import Services from './components/Services'
import Industries from './components/Industries'
import Fleet from './components/Fleet'
import ContractScene from './components/ContractScene'
import Coverage from './components/Coverage'
import Process from './components/Process'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Dialogs from './components/Dialogs'

/* Section order follows the design. */
export default function App() {
  return (
    <UIProvider>
      <a href="#main" className="sr-only z-[100] rounded-lg bg-charcoal px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <ValuesStrip />
        <Services />
        <Industries />
        <Fleet />
        <ContractScene />
        <Coverage />
        <Process />
        <FAQ />
      </main>
      <Footer />
      <Dialogs />
    </UIProvider>
  )
}
