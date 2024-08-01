import { useState, useEffect } from 'react'
import userService from './services/user.service'

function App() {
  const [user, setUser] = useState({
    ho_KH: '',
    ten_KH: '',
    email_KH: '',
    sdt_KH: '',
    matKhau_KH: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const users = await userService.getAll();
  //       setUsers(users);
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);
  const handleSubmit = async (e) => {
    console.log(user.ho_KH);
    e.preventDefault();
    try {
      const response = await userService.create(user);
      setSuccess('Registration successful!');
      // Clear the form
      setUser({
        ho_KH: '',
        ten_KH: '',
        email_KH: '',
        sdt_KH: '',
        matKhau_KH: '',
      });
      } catch (err) {
        console.log(user);
        setError('Registration failed. Please try again.');
      }
    };
  return (
    <>
      <h1>Đăng ký</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        Họ: 
        <input type="text" name="ten_KH" value={user.ten_KH} onChange={(e)=>setUser({...user, ten_KH: e.target.value})} required/>
        Tên: 
        <input type="text" name="ten_KH" value={user.ho_KH} onChange={(e)=>setUser({...user, ho_KH: e.target.value})} required/>
        SĐT: 
        <input type="text" name="ten_KH" value={user.sdt_KH} onChange={(e)=>setUser({...user, sdt_KH: e.target.value})} required/>
        Email: 
        <input type="text" name="ten_KH" value={user.email_KH} onChange={(e)=>setUser({...user, email_KH: e.target.value})} required/>
        Password: 
        <input type="text" name="ten_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} required/>
        <button>Submit</button>
      </form>
      {user.ho_KH + ' ' + user.ten_KH + ' ' + user.email_KH + ' ' + user.sdt_KH + ' ' + user.matKhau_KH}
      {/* <div>
        <h1>Users</h1>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.ho_KH +' '+ user.ten_KH}</li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div> */}
    </>
  )
}

export default App
