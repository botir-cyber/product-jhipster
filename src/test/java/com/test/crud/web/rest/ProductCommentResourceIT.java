package com.test.crud.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.test.crud.IntegrationTest;
import com.test.crud.domain.Product;
import com.test.crud.domain.ProductComment;
import com.test.crud.repository.ProductCommentRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductCommentResourceIT {

    private static final String DEFAULT_PRODUCT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductCommentRepository productCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductCommentMockMvc;

    private ProductComment productComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductComment createEntity(EntityManager em) {
        ProductComment productComment = new ProductComment()
            .productComment(DEFAULT_PRODUCT_COMMENT)
            .author(DEFAULT_AUTHOR)
            .commentTitle(DEFAULT_COMMENT_TITLE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        productComment.setProduct(product);
        return productComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductComment createUpdatedEntity(EntityManager em) {
        ProductComment productComment = new ProductComment()
            .productComment(UPDATED_PRODUCT_COMMENT)
            .author(UPDATED_AUTHOR)
            .commentTitle(UPDATED_COMMENT_TITLE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createUpdatedEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        productComment.setProduct(product);
        return productComment;
    }

    @BeforeEach
    public void initTest() {
        productComment = createEntity(em);
    }

    @Test
    @Transactional
    void createProductComment() throws Exception {
        int databaseSizeBeforeCreate = productCommentRepository.findAll().size();
        // Create the ProductComment
        restProductCommentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isCreated());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeCreate + 1);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getProductComment()).isEqualTo(DEFAULT_PRODUCT_COMMENT);
        assertThat(testProductComment.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testProductComment.getCommentTitle()).isEqualTo(DEFAULT_COMMENT_TITLE);
    }

    @Test
    @Transactional
    void createProductCommentWithExistingId() throws Exception {
        // Create the ProductComment with an existing ID
        productComment.setId(1L);

        int databaseSizeBeforeCreate = productCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductCommentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductComments() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        // Get all the productCommentList
        restProductCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].productComment").value(hasItem(DEFAULT_PRODUCT_COMMENT)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].commentTitle").value(hasItem(DEFAULT_COMMENT_TITLE)));
    }

    @Test
    @Transactional
    void getProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        // Get the productComment
        restProductCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, productComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productComment.getId().intValue()))
            .andExpect(jsonPath("$.productComment").value(DEFAULT_PRODUCT_COMMENT))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.commentTitle").value(DEFAULT_COMMENT_TITLE));
    }

    @Test
    @Transactional
    void getNonExistingProductComment() throws Exception {
        // Get the productComment
        restProductCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment
        ProductComment updatedProductComment = productCommentRepository.findById(productComment.getId()).get();
        // Disconnect from session so that the updates on updatedProductComment are not directly saved in db
        em.detach(updatedProductComment);
        updatedProductComment.productComment(UPDATED_PRODUCT_COMMENT).author(UPDATED_AUTHOR).commentTitle(UPDATED_COMMENT_TITLE);

        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getProductComment()).isEqualTo(UPDATED_PRODUCT_COMMENT);
        assertThat(testProductComment.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testProductComment.getCommentTitle()).isEqualTo(UPDATED_COMMENT_TITLE);
    }

    @Test
    @Transactional
    void putNonExistingProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productComment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductCommentWithPatch() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment using partial update
        ProductComment partialUpdatedProductComment = new ProductComment();
        partialUpdatedProductComment.setId(productComment.getId());

        partialUpdatedProductComment.author(UPDATED_AUTHOR).commentTitle(UPDATED_COMMENT_TITLE);

        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getProductComment()).isEqualTo(DEFAULT_PRODUCT_COMMENT);
        assertThat(testProductComment.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testProductComment.getCommentTitle()).isEqualTo(UPDATED_COMMENT_TITLE);
    }

    @Test
    @Transactional
    void fullUpdateProductCommentWithPatch() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment using partial update
        ProductComment partialUpdatedProductComment = new ProductComment();
        partialUpdatedProductComment.setId(productComment.getId());

        partialUpdatedProductComment.productComment(UPDATED_PRODUCT_COMMENT).author(UPDATED_AUTHOR).commentTitle(UPDATED_COMMENT_TITLE);

        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getProductComment()).isEqualTo(UPDATED_PRODUCT_COMMENT);
        assertThat(testProductComment.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testProductComment.getCommentTitle()).isEqualTo(UPDATED_COMMENT_TITLE);
    }

    @Test
    @Transactional
    void patchNonExistingProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeDelete = productCommentRepository.findAll().size();

        // Delete the productComment
        restProductCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, productComment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
