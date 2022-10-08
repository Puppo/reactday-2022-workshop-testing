import { Link } from 'react-router-dom';
import rtlLogo from '../../images/goat.png';
import logo from '../../images/logo.svg';
import './Home.scss';

export default function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <div className="Home-logos">
          <img src={logo} className="Home-logo" alt="React Logo" />
          <img src={rtlLogo} className="Home-logo" alt="React Testing Library Logo" />
        </div>
        <a href='https://2022.reactjsday.it/'>
          <h3>ReactDay 2022</h3>
        </a>

        <p>
          <a href="https://2022.reactjsday.it/workshop/workshop_Unit-Test.html">Workshop</a><br />Integrare Unit test in applicazioni React
        </p>

        <p>
          <Link to={'/search'}>
            <button className='button'>Go to App</button>
          </Link>
        </p>
      </header>
    </div>
  );
}
