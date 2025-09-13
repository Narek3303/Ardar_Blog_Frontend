import React, { useState } from "react";

const ProductColors = ({ colors }) => {
    const [selectedColor, setSelectedColor] = useState(null);

    return (
        <div>
            <label>Select Color:</label>
            <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                {colors.map((color) => (
                    <option key={color.id} value={color.id}>{color.name}</option>
                ))}
            </select>
        </div>
    );
};

export default ProductColors;
