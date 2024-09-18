// app/components/Nav.tsx

export default function Nav() {
    return (
      <nav className="bg-gray-800">
        <ul className="flex space-x-4 p-4 text-white">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/tool">Tool</a>
          </li>
        </ul>
      </nav>
    );
  }
  