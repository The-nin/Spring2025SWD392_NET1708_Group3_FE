import { Button } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-8xl pb-5'>Oops!</h1>
        <h2 className='text-3xl'>404 - PAGE NOT FOUND</h2>
        <p>The page are looking for might have been removed, <br />
            had its name changed or is temporarily unavailable.</p>
        <Link to={'/'}>
            <Button className='bg-blue-500 text-white'>Go Back Home</Button>
        </Link>
    </div>
  );
}

export default NotFound