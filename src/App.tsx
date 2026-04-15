import { Input } from "@/components/ui/input"
import './styles/index.css'

function App() {
  return (
    <section id="center">
      <h1>Reviews</h1>

      <div>
        <Input placeholder="Filter by rating" type="text" />
      </div>
    </section>
  )
}

export default App
