const About = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">About Page</h1>
<img
  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
  alt="Web Development"
  className="mx-auto w-80 rounded-lg shadow-lg mt-6"
/>

      <p className="text-gray-600 max-w-2xl mx-auto">
        This website is a simple React application built to demonstrate
        page routing using React Router. It includes multiple pages such
        as Home, Cards, and About with smooth navigation between them
        without reloading the page.
      </p>

      <p className="text-gray-600 max-w-2xl mx-auto mt-6">
        The user interface is designed using Tailwind CSS to create
        a clean and responsive layout that works well on both desktop
        and mobile devices.
      </p>
      
    </div>
  );
};

export default About;