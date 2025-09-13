import React from "react";
import '../styles/SizeSelector.css';


const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => {
    return (
        <div className="size-selector">
            <h3 className="font-medium mb-1">Չափս:</h3>
            <select
                value={selectedSize}
                onChange={(e) => onSelectSize(e.target.value)}
                className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Ընտրել չափս</option>
                {sizes.map(size => (
                    <option key={size.id} value={size.slug}>
                        {size.name}
                    </option>
                ))}
            </select>
        </div>

    );
};

export default SizeSelector;
