import { AccountProvider } from "./providers/UserProvider";
import AppRouter from "./routers/AppRouter";


export default function App() {
  return (
    <AccountProvider>
      <AppRouter/>
    </AccountProvider>

  )
}