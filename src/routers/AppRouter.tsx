import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";
import PDFUploader from "@/pages/pdf-preview";

export default function AppRouter() {
  return (<>
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="pdf" element={<PDFUploader />} />
      </Route>
    </Routes>
  </>)
}