import { AccountProvider } from "./providers/userProvider";
import AppRouter from "./routers/AppRouter";


export default function App() {
  return (
    <AccountProvider>
      <AppRouter/>
    </AccountProvider>
  )
}