

const ModifyPassword = (id) => {
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    
    return (
        <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password"/>
        </div>
    )
}

export default ModifyPassword;