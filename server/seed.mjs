import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({ 
  name: String, 
  email: String, 
  password: String, 
  role: String, 
  title: String, 
  isAdmin: Boolean, 
  isActive: { type: Boolean, default: true }, 
  tasks: [] 
});
const User = mongoose.model('User', userSchema);

await mongoose.connect(process.env.MONGODB_URI);

const hash = await bcrypt.hash('Admin1234', 10);

await User.create({ name: 'John Developer', email: 'john@test.com', password: hash, role: 'Developer', title: 'Frontend Dev', isAdmin: false, isActive: true });
await User.create({ name: 'Sarah Designer', email: 'sarah@test.com', password: hash, role: 'Designer', title: 'UI Designer', isAdmin: false, isActive: true });
await User.create({ name: 'Mike Manager', email: 'mike@test.com', password: hash, role: 'Manager', title: 'Project Manager', isAdmin: false, isActive: true });

console.log('3 users created!');
process.exit();