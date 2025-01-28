import { getCookieServer } from "@/lib/cookieServer";
import { api } from "@/services/api";
import Form from "./components/form";

export default async function Product(){
    const token = await getCookieServer();
    const response = await api.get("/category", {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return(
        <main>
            <Form categories={response.data}/>
        </main>     
    )
}