interface Props {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function Home({ user }: Props) {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
