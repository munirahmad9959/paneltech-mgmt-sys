import Slider from "react-slick";
import { projectData } from "../../Utils";


const ProjectSlider = () => {
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="mx-16 mt-10">
            <Slider {...settings}>
                {projectData.map((project, index) => (
                    <div key={index} className="px-2">
                        <div className="bg-white shadow-md overflow-hidden text-center cursor-pointer">
                            <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
                            <div className="px-4 py-7">
                                <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProjectSlider;