import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const carouselSrc = [
    "https://source.unsplash.com/JNuKyKXLh8U",
    "https://source.unsplash.com/kcJsQ3PJrYU",
    "https://source.unsplash.com/Q_KdjKxntH8",
    "https://source.unsplash.com/U7HLzMO4SIY",
    "https://source.unsplash.com/LETdkk7wHQk",
  ]
export const ImageGallery: React.FC = () => (<Carousel className="w-full max-w-full h-96">
    <CarouselContent className="h-96">
      {carouselSrc.map((item, index) => (
        <CarouselItem key={index} className="h-96">
          <div className="p-0 h-96">
            <Card className="h-96">
              <CardContent className="flex items-center w-full justify-center p-0 rounded-lg h-96">
                <img src={item} alt="lorem ipsum" className="w-full rounded-lg h-full object-cover" />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-11" />
    <CarouselNext className="right-11"/>
  </Carousel>);