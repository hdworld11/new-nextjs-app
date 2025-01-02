'use client'

import { StorageImage } from '@aws-amplify/ui-react-storage';
import { list, ListAllWithPathOutput } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';

// Define the type for our image items
type ImageItem = ListAllWithPathOutput & { path: string };

export const DefaultStorageImageExample = () => {

    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log(Amplify.getConfig());

        list({
            path: 'picture-submissions/',
            options: {
                listAll: true,
                bucket: 'myFirstBucket',            }
        })
        .then(result => {
            console.log(result);
            setImages(result.items as ImageItem[]);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching images:', err);
            setError('Failed to load images');
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (images.length === 0) return <p>No images available</p>;

    return (
        <div>
            {images.map((image, index) => (
                <StorageImage key={index} alt="test" path={image.path} />
            ))}
        </div>
    );
};