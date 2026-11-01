
import Hero from "./components/Hero";
import PopularCourses from "./components/PopularCourses";
import Statistics from "./components/Statistics";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PopularCourses />
      <Statistics />
      <Testimonials />
      <CallToAction />
    </main>
  );
}
