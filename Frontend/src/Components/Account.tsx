import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const account = () => {

    const [user, setUser] = useState<any>(null)
    const [address, setAddress] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setAddress(JSON.parse(storedUser).address || "")
        }

        console.log(storedUser);

    }, [])

    const handleSaveAddress = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.put(
            "http://localhost:5000/api/auth/address",
            { address },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        setIsEditing(false);
        alert("Address updated!");
    };

    const handleDeleteAddress = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.put(
            "http://localhost:5000/api/auth/address",
            { address: "" },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        setAddress("");
        alert("Address deleted!");
    };

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }
    if (!user) {
        return <p>no user found</p>
    }
    return (
        <div className="p-7 flex flex-col justify-center items-center background h-screen">
            <div>
                <button
                    onClick={() => {navigate('/dashboard')}}
                    className="mt-4 nav text-white px-4 py-2 rounded cursor-pointer fixed top-5 right-7"
                >Dashboard</button>
            </div>
            <div className="p-7 shadow-2xl  w-full md:w-1/3 rounded-xl bg-white">
                <h2 className="text-2xl font-bold mb-5">My Account</h2>
                <p><span className="font-semibold">Name:</span> {user.name}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Role:</span> {user.role}</p>
                <div className="my-3">
                  <p className="font-semibold mb-1">Address:</p>

                {!address && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer p-2 nav rounded text-white w-full"
                    >Add Address</button>
                )}
                {address && !isEditing && (
                    <div>
                        <p>{address}</p>
                        <div className="flex gap-5 mt-5">
                            <button
                                onClick={() => { setIsEditing(true) }}
                                className="cursor-pointer p-1 rounded nav text-white w-full"
                            >Edit</button>
                            <button
                                onClick={handleDeleteAddress}
                                className="cursor-pointer p-1 rounded btn text-white w-full"
                            >Delete</button>
                        </div>
                    </div>
                )}  
                </div>
                
                {isEditing && (
                    <div>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border p-2 w-full"
                            placeholder="Enter your address"
                        />

                        <button
                            onClick={handleSaveAddress}
                            className="mt-4 nav text-white px-4 py-2 rounded w-full"
                        >
                            Save Address
                        </button>
                    </div>
                )}

                

                <button
                    onClick={handleLogout}
                    className="mt-4 btn text-white px-4 py-2 rounded w-full cursor-pointer"
                >Logout</button>
            </div>
        </div>

    )
}

export default account