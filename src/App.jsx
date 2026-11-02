import { UIProvider } from './context/UIContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import ContractScene from './components/ContractScene'
import Fleet from './components/Fleet'
import Coverage from './components/Coverage'
import Industries from './components/Industries'
import Process from './components/Process'
import About from './components/About'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Dialogs from './components/Dialogs'

export default function App() {
  return (
    <UIProvider>
      <a href="#main" className="sr-only z-[100] rounded-full bg-charcoal px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <ContractScene />
        <Fleet />
        <Coverage />
        <Industries />
        <Process />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Dialogs />
    </UIProvider>
  )
}
