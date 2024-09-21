const BackgroundVideo = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
            <video
                autoPlay
                loop
                muted
                className="object-cover w-full h-full"
            >
                <source src="/background.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default BackgroundVideo;