package com.test.crud.repository;

import com.test.crud.domain.ProductComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {}
