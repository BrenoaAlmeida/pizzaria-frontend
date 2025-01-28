import { getCookieServer } from "@/lib/cookieServer";
import Orders from "./components/orders";
import { api } from "@/services/api";
import { OrdersProp } from "@/lib/order.type";

async function getOrders(): Promise<OrdersProp[] | []>{
    try{
        const token = await getCookieServer();
        const response = await api.get("/orders", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return response.data || []
    } catch(err){
        console.log(err);
        return [];
    }
}

export default async function Dashboard(){

    const orders = await getOrders();
    return(
        <div>
            <Orders orders={orders} />
        </div>
    )
}