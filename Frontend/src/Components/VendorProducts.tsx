import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/products";

const VendorProducts = ({ refreshStats }: any) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const token = localStorage.getItem("token");

  // Fetch products
  const fetchProducts = async () => {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async () => {
    if (editingId) {
      // UPDATE
      await axios.put(`${API}/${editingId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // ➕ CREATE
      await axios.post(API, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
    });

    fetchProducts();
    refreshStats();
  };

  // Delete product
  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
    refreshStats();
  };

  return (
    <div className="px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Products</h2>

        <button
          onClick={() => setShowForm(true)}
          className="nav flex items-center gap-2 text-white font-semibold px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
          <input
            placeholder="Image URL (optional)"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />
          <input
            placeholder="Name"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            placeholder="Description"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <input
            placeholder="Price"
            type="number"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
          <input
            placeholder="Stock"
            type="number"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Product" : "Save Product"}
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <div key={p._id} className="bg-white p-4 rounded shadow capitalize">
            <a href={p.image}>
              <img
                src={p.image}
                alt={p.name}
                className="h-32 w-full object-cover rounded mb-2"
              /></a>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-600">{p.description}</p>
            <p className="font-semibold">₹{p.price}</p>
            <p>Stock: {p.stock}</p>

            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(p._id);

                setForm({
                  name: p.name,
                  description: p.description,
                  price: p.price,
                  stock: p.stock,
                  image: p.image || "",
                });
              }}
              className="mt-2 w-full nav text-white py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(p._id)}
              className="mt-2 w-full btn text-white py-1 rounded"
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;