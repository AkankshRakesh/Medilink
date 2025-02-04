import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-3 min-h-screen items-center justify-center my-auto">
        <p className="text-4xl">Welcome to moodl</p>
        <p className="text-2xl">Something is big..!!</p>
      </div>
    </>
  );
}

export default App;
