package com.test.crud.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductComment.
 */
@Entity
@Table(name = "product_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProductComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "product_comment")
    private String productComment;

    @Column(name = "author")
    private String author;

    @Column(name = "comment_title")
    private String commentTitle;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "productComments", "productCategory" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductComment() {
        return this.productComment;
    }

    public ProductComment productComment(String productComment) {
        this.setProductComment(productComment);
        return this;
    }

    public void setProductComment(String productComment) {
        this.productComment = productComment;
    }

    public String getAuthor() {
        return this.author;
    }

    public ProductComment author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCommentTitle() {
        return this.commentTitle;
    }

    public ProductComment commentTitle(String commentTitle) {
        this.setCommentTitle(commentTitle);
        return this;
    }

    public void setCommentTitle(String commentTitle) {
        this.commentTitle = commentTitle;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductComment product(Product product) {
        this.setProduct(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductComment)) {
            return false;
        }
        return id != null && id.equals(((ProductComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductComment{" +
            "id=" + getId() +
            ", productComment='" + getProductComment() + "'" +
            ", author='" + getAuthor() + "'" +
            ", commentTitle='" + getCommentTitle() + "'" +
            "}";
    }
}
