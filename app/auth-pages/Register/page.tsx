
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

export const Register = () => {

  const router = useRouter();

  // State variables for form inputs and error messages
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('tenant'); // Default role
  const [error, setError] = useState('');

  return (
    <div>Register</div>
  )
}
