import React, { useEffect, useState } from "react";
import CategoryList from "../components/CategoryList";
import axios from "axios";

const HomePage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("/shop/category/") // փոխիր ըստ քո API-ի
            .then((res) => {
                setCategories(res.data);
            });
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-4">Explore Categories</h1>
            <CategoryList categories={categories} />
        </div>
    );
};

export default HomePage;
