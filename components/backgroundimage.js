import React from "react";

const BackgroundImage = ({ src }) => {
    return (
        <div
            className="fixed top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center z-[-1]"
            style={{ backgroundImage: `url(${src})` }}
        />
    );
};

export default BackgroundImage;