package coldblooded.project.prototype.config;

import coldblooded.project.prototype.entity.Category;
import coldblooded.project.prototype.entity.Product;
import coldblooded.project.prototype.repository.CategoryRepository;
import coldblooded.project.prototype.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        Category electronics = null;
        Category clothing = null;
        Category accessories = null;
        
        if (categoryRepository.count() == 0) {
            electronics = new Category();
            electronics.setName("Electronics");
            electronics.setSlug("electronics");
            electronics.setDescription("Gadgets and devices");
            electronics = categoryRepository.save(electronics);

            clothing = new Category();
            clothing.setName("Clothing");
            clothing.setSlug("clothing");
            clothing.setDescription("Apparel and fashion");
            clothing = categoryRepository.save(clothing);

            accessories = new Category();
            accessories.setName("Accessories");
            accessories.setSlug("accessories");
            accessories.setDescription("Fashion accessories");
            accessories = categoryRepository.save(accessories);
        } else {
            // Find categories if they exist (simplification for seeding)
            try {
                electronics = categoryRepository.findAll().stream().filter(c -> c.getName().equals("Electronics")).findFirst().orElse(null);
                clothing = categoryRepository.findAll().stream().filter(c -> c.getName().equals("Clothing")).findFirst().orElse(null);
                accessories = categoryRepository.findAll().stream().filter(c -> c.getName().equals("Accessories")).findFirst().orElse(null);
            } catch (Exception e) {}
        }

        if (productRepository.count() == 0 && electronics != null && clothing != null && accessories != null) {
            Product p1 = new Product();
            p1.setName("iPhone 14 128GB");
            p1.setSku("IPHONE-14-128");
            p1.setDescription("Latest Apple iPhone 14 with 128GB storage.");
            p1.setBasePrice(new BigDecimal("89567.00"));
            p1.setCategory(electronics);
            p1.setStock(50);
            p1.setImagePath("https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-blue-select-202209?wid=940&hei=1112&fmt=png-alpha&.v=1660730042356");
            productRepository.save(p1);

            Product p2 = new Product();
            p2.setName("Samsung Galaxy M33");
            p2.setSku("SAMSUNG-M33");
            p2.setDescription("Samsung Galaxy M33 5G.");
            p2.setBasePrice(new BigDecimal("17999.00"));
            p2.setCategory(electronics);
            p2.setStock(100);
            p2.setImagePath("https://images.samsung.com/is/image/samsung/p6pim/in/sm-m336bzbpins/gallery/in-galaxy-m33-5g-sm-m336-sm-m336bzbpins-531862590?$650_519_PNG$");
            productRepository.save(p2);

            Product p3 = new Product();
            p3.setName("Classic T-Shirt");
            p3.setSku("TSHIRT-CLASSIC");
            p3.setDescription("Soft cotton tee with relaxed fit.");
            p3.setBasePrice(new BigDecimal("699.00"));
            p3.setDiscount(new BigDecimal("20.00"));
            p3.setCategory(clothing);
            p3.setStock(200);
            p3.setImagePath("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80");
            productRepository.save(p3);

            Product p4 = new Product();
            p4.setName("Oversized Hoodie");
            p4.setSku("HOODIE-OVER");
            p4.setDescription("Cozy fleece hoodie for chilly days.");
            p4.setBasePrice(new BigDecimal("1499.00"));
            p4.setDiscount(new BigDecimal("15.00"));
            p4.setCategory(clothing);
            p4.setStock(150);
            p4.setImagePath("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80");
            productRepository.save(p4);

            Product p5 = new Product();
            p5.setName("Minimal Sneakers");
            p5.setSku("SNEAK-MIN");
            p5.setDescription("Clean white sneakers suitable for any outfit.");
            p5.setBasePrice(new BigDecimal("2499.00"));
            p5.setDiscount(new BigDecimal("25.00"));
            p5.setCategory(accessories);
            p5.setStock(80);
            p5.setImagePath("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80");
            productRepository.save(p5);

            Product p6 = new Product();
            p6.setName("Everyday Tote Bag");
            p6.setSku("TOTE-BAG");
            p6.setDescription("Durable canvas tote with laptop sleeve.");
            p6.setBasePrice(new BigDecimal("999.00"));
            p6.setDiscount(new BigDecimal("10.00"));
            p6.setCategory(accessories);
            p6.setStock(120);
            p6.setImagePath("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80");
            productRepository.save(p6);
        }
    }
}
