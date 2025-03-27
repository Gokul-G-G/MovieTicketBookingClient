import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosInstance";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        // console.log("Users Response:", response.data);

        // Extract the actual user list from the response
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        // console.log("Delete Response:", response);

        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );

          Swal.fire("Deleted!", "The user has been removed.", "success");
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (err) {
        // console.error("Error deleting user:", err);
        Swal.fire("Error!", "Failed to delete the user.", "error");
      }
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User List</h2>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="col-md-4 mb-4">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {user.email}
                  </Card.Subtitle>
                  <Card.Text>
                    Role: <strong>{user.role}</strong>
                  </Card.Text>
                  <Card.Text>
                    Status:{" "}
                    {user.isActive ? (
                      <span className="text-success">🟢 Active</span>
                    ) : (
                      <span className="text-danger">🔴 Inactive</span>
                    )}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
