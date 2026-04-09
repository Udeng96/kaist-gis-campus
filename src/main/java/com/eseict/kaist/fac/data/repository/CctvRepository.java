package com.eseict.kaist.fac.data.repository;

import com.eseict.kaist.fac.data.vo.TblCctv;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;

public interface CctvRepository extends JpaRepository<TblCctv, Long> {

    Optional<TblCctv> findByStreamId(String streamId);

    @Query("""
                SELECT c
                FROM TblCctv c
                WHERE c.streamId LIKE CONCAT(:prefix, '%')
                  AND c.streamId NOT LIKE '%_HIGH'
                ORDER BY c.streamId DESC
            """)
    Optional<TblCctv> findLatestNormalCctvByPrefix(@Param("prefix") String prefix);

    Page<TblCctv> findByStreamIdNotLike(String pattern, Pageable pageable);

    Page<TblCctv> findByStreamIdInAndStreamIdNotLike(Collection<String> streamIds, String pattern, Pageable pageable);

    boolean existsByStreamId(String streamId);
}
