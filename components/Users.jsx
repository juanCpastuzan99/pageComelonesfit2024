"use client";
import { useRouter } from "next/navigation";
export default function Users({users}){
    const router = useRouter()
    return ( <div>
         <ul className="list-group"> 
    {  users.map ((user)=>(
      <li key={user.id} className="list-group- item d-flex justify-content-between align-items-center list-group-item-action"
      onClick={()=>{router.push(`/users/${user.id}`)}}
      >
        <div>
        <h5> {user.id}</h5>
        <p>{user.email}</p>
        </div>
        <img src={user.avatar} alt ={user.email} style={{borderRadius: "50%" }} />
      </li>
    ))}

</ul>
    </div> )

}