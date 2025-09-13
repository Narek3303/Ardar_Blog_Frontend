const WishlistHeader = ({ itemCount }) => (
    <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
            Your Wishlist
        </h1>
        <p className="text-gray-600 mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
    </header>
);