# Security cleanup

Internal connection examples and fixed credentials were removed from the latest source. Real connection settings and credentials must be supplied separately. Existing commit history was preserved; previously exposed values are not revoked by this change. Rotate any credentials still in use.

This change is limited to security cleanup. The legacy repository has separate refactored UI code; its existing build problems are not fixed by this commit. The consolidated portfolio is kaist-campus-gis.
